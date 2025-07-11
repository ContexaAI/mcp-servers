#!/bin/bash

# Docker Build Script (Bash version)
# This script iterates through all subdirectories in the current directory,
# finds those containing Dockerfiles, and runs 'docker buildx build' with the
# folder name as the tag, pushing to gcr.io/prod-bytequery/.
# Usage: ./docker-build.sh [directory_name]
# If directory_name is provided, only that directory will be built.
# If no directory_name is provided, all directories with Dockerfiles will be built.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

# Function to cleanup container
cleanup_container() {
    local container_id="$1"
    if [ -n "$container_id" ]; then
        print_status "Cleaning up container $container_id..."
        docker stop "$container_id" > /dev/null 2>&1
        docker rm "$container_id" > /dev/null 2>&1
    fi
}

# Function to run docker build
run_docker_build() {
    local dir="$1"
    local tag="$2"
    local container_id=""
    
    # Set up trap to cleanup container on exit
    trap 'cleanup_container "$container_id"' EXIT
    
    print_status "Building $tag from $dir..."
    
    # Build the image locally for testing (native platform)
    print_status "Building local test image..."
    if docker build -t "$tag:test" "$dir"; then
        print_success "✅ Successfully built local test image $tag:test"
    else
        print_error "❌ Failed to build local test image for $tag"
        print_error "Stopping build process due to failure."
        exit 1
    fi
    
    # Run the container for testing
    print_status "Testing $tag on port 8080..."
    container_id=$(docker run -d -p 8080:8080 "$tag:test")
    
    if [ -z "$container_id" ]; then
        print_error "❌ Failed to start container for $tag"
        exit 1
    fi
    
    print_status "Container started with ID: $container_id"
    
    # Wait for container to be ready
    print_status "Waiting for container to be ready..."
    sleep 10
    
    # Test health endpoints
    local health_status=0
    local root_status=0
    
    # Test /health endpoint
    print_status "Testing /health endpoint..."
    if curl -f -s http://localhost:8080/health > /dev/null 2>&1; then
        print_success "✅ /health endpoint returned 200"
        health_status=1
    else
        print_error "❌ /health endpoint failed"
    fi
    
    # Test / endpoint
    print_status "Testing / endpoint..."
    if curl -f -s http://localhost:8080/ > /dev/null 2>&1; then
        print_success "✅ / endpoint returned 200"
        root_status=1
    else
        print_error "❌ / endpoint failed"
    fi
    
    # Stop and remove the test container
    print_status "Stopping test container..."
    cleanup_container "$container_id"
    container_id=""  # Clear container_id to prevent double cleanup
    
    # Check if both tests passed
    if [ $health_status -eq 1 ] && [ $root_status -eq 1 ]; then
        print_success "✅ All health checks passed for $tag"
        
        # Build the production image for the target platform
        print_status "Building production image for linux/amd64..."
        if docker buildx build --platform=linux/amd64 -t "gcr.io/prod-bytequery/$tag:latest" --push "$dir"; then
            print_success "✅ Successfully built and pushed gcr.io/prod-bytequery/$tag:latest"
            
            # Clean up local test image
            docker rmi "$tag:test" > /dev/null 2>&1
            return 0
        else
            print_error "❌ Failed to build and push production image for $tag"
            exit 1
        fi
    else
        print_error "❌ Health checks failed for $tag - not pushing to registry"
        # Clean up local test image
        docker rmi "$tag:test" > /dev/null 2>&1
        exit 1
    fi
}

# Main script
main() {
    local target_dir="$1"
    
    if [ -n "$target_dir" ]; then
        # Build specific directory
        if [ ! -d "$target_dir" ]; then
            print_error "❌ Directory '$target_dir' not found."
            exit 1
        fi
        
        if [ ! -f "$target_dir/Dockerfile" ]; then
            print_error "❌ Directory '$target_dir' does not contain a Dockerfile."
            exit 1
        fi
        
        print_status "Building specific directory: $target_dir"
        run_docker_build "$target_dir" "$target_dir"
        print_success "🎉 Build completed successfully!"
        return 0
    fi
    
    # Build all directories
    print_status "Scanning for directories with Dockerfiles..."
    
    # Find all subdirectories (excluding hidden ones)
    subdirs=($(find . -maxdepth 1 -type d -not -name ".*" -not -name "." | sort))
    
    if [ ${#subdirs[@]} -eq 0 ]; then
        print_warning "No subdirectories found."
        exit 0
    fi
    
    print_status "Found ${#subdirs[@]} subdirectories"
    
    # Find directories with Dockerfiles
    docker_dirs=()
    for dir in "${subdirs[@]}"; do
        dirname=$(basename "$dir")
        if [ -f "$dir/Dockerfile" ]; then
            docker_dirs+=("$dir")
            print_status "  📁 $dirname (has Dockerfile)"
        else
            print_warning "  📁 $dirname (no Dockerfile)"
        fi
    done
    
    if [ ${#docker_dirs[@]} -eq 0 ]; then
        print_warning "No directories with Dockerfiles found."
        exit 0
    fi
    
    echo
    print_status "Found ${#docker_dirs[@]} directories with Dockerfiles"
    echo "=================================================="
    
    # Build each directory (will stop on first failure due to set -e)
    successful_builds=0
    
    for dir in "${docker_dirs[@]}"; do
        tag=$(basename "$dir")
        run_docker_build "$dir" "$tag"
        ((successful_builds++))
        echo  # Add spacing between builds
    done
    
    # Summary (only reached if all builds succeed)
    echo "=================================================="
    print_status "Build Summary:"
    print_success "  ✅ Successful: $successful_builds"
    print_status "  📊 Total: ${#docker_dirs[@]}"
    echo
    print_success "🎉 All builds completed successfully!"
}

# Function to show help
show_help() {
    echo "Docker Build Script"
    echo ""
    echo "Usage: $0 [directory_name]"
    echo ""
    echo "Options:"
    echo "  directory_name    Build only the specified directory"
    echo "  -h, --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Build all directories with Dockerfiles"
    echo "  $0 airbnb          # Build only the airbnb directory"
    echo "  $0 github          # Build only the github directory"
    echo ""
    echo "Note: The script will stop on the first build failure."
echo "Images will be built for linux/amd64 platform and pushed to gcr.io/prod-bytequery/"
echo "Each image will be tested locally on port 8080 before pushing."
echo "Health checks: / and /health endpoints must return 200 status."
}

# Check for help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    print_error "❌ Docker not found. Please ensure Docker is installed."
    exit 1
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    print_error "❌ curl not found. Please ensure curl is installed for health checks."
    exit 1
fi

# Run main function
main "$@" 