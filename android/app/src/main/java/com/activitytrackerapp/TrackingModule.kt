package com.activitytrackerapp

import android.content.Intent
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

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    companion object {
        const val NAME = "TrackingModule"
    }
}
