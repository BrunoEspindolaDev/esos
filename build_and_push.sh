#!/bin/bash

DOCKER_USERNAME="brunoespindoladev"
VERSION=${1:-"latest"}

echo "🚀 Starting Docker images build and push..."
echo "📋 Version: $VERSION"
echo "👤 Docker Hub User: $DOCKER_USERNAME"
echo ""

build_and_push() {
    local service=$1
    local context=$2
    local dockerfile=$3
    echo "📦 Building image for $service..."
    if docker build -f "$dockerfile" -t "$DOCKER_USERNAME/esos-$service:$VERSION" "$context"; then
        echo "✅ Image build for $service completed successfully!"
        echo "🚀 Pushing $service image to Docker Hub..."
        if docker push "$DOCKER_USERNAME/esos-$service:$VERSION"; then
            echo "✅ Image $service pushed successfully to Docker Hub!"
            echo ""
        else
            echo "❌ Error pushing $service image to Docker Hub!"
            return 1
        fi
    else
        echo "❌ Error building $service image!"
        return 1
    fi
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running or you don't have adequate permissions!"
    exit 1
fi

# Build and push images
echo "🔄 Starting build and push process..."
echo ""

build_and_push "chat" "./chat" "./chat/Dockerfile"
build_and_push "moderator" "./moderator" "./moderator/Dockerfile"
build_and_push "logs" "./logs" "./logs/Dockerfile"

echo "🎉 Process completed!"
echo ""
echo "📋 Your updated images are available at:"
echo "   - docker.io/$DOCKER_USERNAME/esos-chat:$VERSION"
echo "   - docker.io/$DOCKER_USERNAME/esos-moderator:$VERSION"
echo "   - docker.io/$DOCKER_USERNAME/esos-logs:$VERSION"
echo ""
echo "💡 To use the updated images:"
echo "   1. Update your docker-compose.yml to use these images from Docker Hub"
echo "   2. Or pull the latest images: docker-compose pull"
echo ""
echo "🔄 Usage examples:"
echo "   ./build_and_push.sh           # Uses 'latest' tag"
echo "   ./build_and_push.sh v1.0.0    # Uses 'v1.0.0' tag"
