package com.portableanchors

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ForegroundService"
    }

    @ReactMethod
    fun startService(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, BLEForegroundService::class.java)
            ContextCompat.startForegroundService(reactApplicationContext, intent)
            promise.resolve("started")
        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, BLEForegroundService::class.java)
            reactApplicationContext.stopService(intent)
            promise.resolve("stopped")
        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }

    @Suppress("DEPRECATION")
    @ReactMethod
    fun isRunning(promise: Promise) {
        try {
            val manager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val running = manager.getRunningServices(Int.MAX_VALUE).any { 
                it.service.className == BLEForegroundService::class.java.name 
            }
            promise.resolve(running)
        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }
}
