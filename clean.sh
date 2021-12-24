echo Cleaning react-native metro cache
rm -rf $TMPDIR/react-*

echo Cleaning metro bundler cache
rm -rf $TMPDIR/metro-*

echo Cleaning watchman cache
watchman watch-del-all

echo Cleaning node_modules
rm -rf node_modules

echo Cleaning npm cache
npm cache clean --force

echo Cleaning xcode cache
rm -rf ~/Library/Developer/Xcode/DerivedData

echo Cleaning iOS build folder
rm -rf ios/build

echo Cleaning Cocoapods folder
rm -rf ios/Pods

echo Cleaning Android build folder
rm -rf android/build
rm -rf android/app/build
