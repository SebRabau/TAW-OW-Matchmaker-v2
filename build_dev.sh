# Remove old files
rm -r build;

# Build
tsc;

# Start python server
python -m SimpleHTTPServer 8000

# Open Page
open http://localhost:8000