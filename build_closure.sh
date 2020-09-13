# Remove old files
rm -r build;

# Build
tsc;

# Closure Compile
cd closure-compiler;
java -jar compiler.jar --js ../build/app.js --js_output_file ../build/app-closure.js;
cd ..;