# Activity Tracker App

## 📌 Overview  
**Activity Tracker App** is a React Native mobile application that uses built-in sensors to track user activity, manage medicine reminders, and log session data.  


# Getting Started

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

## 🚀 Features  
### 1. **Activity Tracking**  
- Uses **accelerometer & gyroscope** to detect user activity (Walking, Running, Stationary).  
- Displays **real-time activity type & duration**.  
- Uses a **background service** to track activity when the app is minimized.  

### 2. **Location-Based Tracking**  
- Tracks **GPS location** and **plots path on a map**.  
- Calculates **total distance traveled** during the session.  

### 3. **Dashboard** (Home Tab)  
- Displays **ambient light level & atmospheric pressure**.  
- Displays **total duration & calories & distance**.  
- Users can **start tracking**.  

### 4. **Sessions List** (Sessions Tab)  
- Logs session data **locally using SQLite**.  
- Users can **view past sessions** including distance, activity type, and duration.  

### 5. **Medicine Reminders** (Medicine Tab)  
- Lists **scheduled medicines**.  
- Sends **push notifications** for reminders.  

---

## 🛠️ Tech Stack  
- **React Native** (CLI)  
- **React Navigation** (for tab navigation)  
- **react-native-sensors** (for accelerometer & gyroscope & barometer)
- **react-native-ambient-light-sensor** (for for ambient light sensor)
- **react-native-geolocation-service** (for GPS tracking)  
- **react-native-sqlite-storage** (for local session storage)  
- **@notifee/react-native** (for for notifications) 

---

## 📱 Installation & Setup  
### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/aamernabi/rn-activity-tracker.git

cd ActivityTrackerApp
```
