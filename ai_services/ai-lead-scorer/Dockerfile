FROM python:3.10-slim

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Make healthcheck executable
RUN chmod +x healthcheck.py

# Change ownership
RUN chown -R app:app /app
USER app

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python healthcheck.py

