#!/bin/bash

# Patch react-native-safe-area-context
sed -i '' 's/s\.visionos\.deployment_target/s.visionos.deployment_target if s.respond_to?(:visionos)/g' node_modules/react-native-safe-area-context/react-native-safe-area-context.podspec

# Patch react-native-screens if it exists
if [ -f "node_modules/react-native-screens/react-native-screens.podspec" ]; then
  sed -i '' 's/s\.visionos/s.visionos if s.respond_to?(:visionos)/g' node_modules/react-native-screens/react-native-screens.podspec
fi

# Find all podspec files with visionos references
find node_modules -name "*.podspec" -type f | while read -r file; do
  if grep -q "\.visionos\." "$file" && ! grep -q "respond_to?(:visionos)" "$file"; then
    echo "Patching $file"
    # Only patch lines that don't already have the check
    sed -i '' 's/\(s\.visionos\.[^=]*\)/\1 if s.respond_to?(:visionos)/g' "$file" 2>/dev/null || true
  fi
done

echo "Podspec patching complete"
