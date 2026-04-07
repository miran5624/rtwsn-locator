package com.portableanchors

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override fun getPackages(): MutableList<ReactPackage> {
                val packages = PackageList(this).packages
                packages.add(ForegroundServicePackage())
                packages.add(BLEAdvertiserPackage())
                return packages
            }

            override fun getJSMainModuleName(): String = "index"

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "ble_mesh_channel",
                "Safety Mesh",
                NotificationManager.IMPORTANCE_LOW
            ).apply { description = "BLE mesh background operation" }

            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }
    }
}
