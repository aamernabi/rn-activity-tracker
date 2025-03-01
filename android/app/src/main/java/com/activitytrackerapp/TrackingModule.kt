package com.activitytrackerapp

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

class TrackingModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return NAME
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

    companion object {
        const val NAME = "TrackingModule"
    }
}
