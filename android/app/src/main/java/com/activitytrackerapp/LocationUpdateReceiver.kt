package com.activitytrackerapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class LocationUpdateReceiver(private val callback: (WritableMap) -> Unit) : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == LocationTrackingService.LOCATION_UPDATE_ACTION) {
            val latitude = intent.getDoubleExtra("latitude", 0.0)
            val longitude = intent.getDoubleExtra("longitude", 0.0)

            val locationData: WritableMap = Arguments.createMap().apply {
                putDouble("latitude", latitude)
                putDouble("longitude", longitude)
            }

            callback(locationData)
        }
    }
}