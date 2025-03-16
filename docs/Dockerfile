# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /docs

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    mkdocs \
    mkdocs-material \
    pygments \
    pymdown-extensions \
    mkdocs-git-revision-date-localized-plugin

# Copy only the necessary files
COPY mkdocs.yml .
COPY docs ./docs

# Expose port 8000 for mkdocs serve
EXPOSE 8000

# Default command to serve documentation
CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000"]