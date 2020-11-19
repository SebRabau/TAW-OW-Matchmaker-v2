# Remove old files
rm -r build;

# Build
tsc;

# Closure Compile
cd closure-compiler;
java -jar compiler.jar --js ../build/*.js --js_output_file ../closure_build/app-closure.js;
cd ..;

# Remove old files
rm -r build;

# Move to build folder
mv closure_build build;