package com.activitytrackerapp

import android.content.Intent
import android.content.Context
import android.app.ActivityManager
import android.content.IntentFilter
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class TrackingModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val locationUpdateReceiver = LocationUpdateReceiver { locationData ->
        sendEvent("onLocationUpdate", locationData)
    }

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()
        reactApplicationContext.registerReceiver(locationUpdateReceiver, IntentFilter(LocationTrackingService.LOCATION_UPDATE_ACTION))
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        reactApplicationContext.unregisterReceiver(locationUpdateReceiver)
    }

    @ReactMethod
    fun startTrackingService(promise: Promise) {
        val serviceIntent = Intent(reactApplicationContext, LocationTrackingService::class.java)
        reactApplicationContext.startForegroundService(serviceIntent)

        promise.resolve("service started")
    }

    @ReactMethod
    fun stopTrackingService(promise: Promise) {
        val serviceIntent = Intent(reactApplicationContext, LocationTrackingService::class.java)
        reactApplicationContext.stopService(serviceIntent)
        promise.resolve("service stopped")
    }

    @ReactMethod
    fun isTrackingServiceRunning(promise: Promise) {
        val isRunning = isServiceRunning(LocationTrackingService::class.java)
        promise.resolve(isRunning)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun isServiceRunning(serviceClass: Class<*>): Boolean {
        val manager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        for (service in manager.getRunningServices(Int.MAX_VALUE)) {
            if (serviceClass.name == service.service.className) {
                return true
            }
        }
        return false
    }

    companion object {
        const val NAME = "TrackingModule"
    }
}
