package com.portableanchors

import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.content.Context
import android.os.ParcelUuid
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BLEAdvertiserModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var advertiseCallback: AdvertiseCallback? = null

    override fun getName(): String {
        return "BLEAdvertiser"
    }

    @ReactMethod
    fun startAdvertising(serviceUUID: String, payload: String, promise: Promise) {
        try {
            val bluetoothManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            val adapter = bluetoothManager?.adapter
            val bluetoothLeAdvertiser = adapter?.bluetoothLeAdvertiser

            if (bluetoothLeAdvertiser == null) {
                promise.reject("BLE_UNAVAILABLE", "Not supported")
                return
            }

            val settings = AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(false)
                .setTimeout(0)
                .build()

            val data = AdvertiseData.Builder()
                .addServiceUuid(ParcelUuid.fromString("0000AA01-0000-1000-8000-00805F9B34FB"))
                .addManufacturerData(
                    0x0059,
                    payload.toByteArray(Charsets.UTF_8).take(20).toByteArray()
                )
                .setIncludeDeviceName(false)
                .build()

            advertiseCallback = object : AdvertiseCallback() {
                override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                    super.onStartSuccess(settingsInEffect)
                    promise.resolve("advertising")
                }

                override fun onStartFailure(errorCode: Int) {
                    super.onStartFailure(errorCode)
                    promise.reject("ADV_FAIL", errorCode.toString())
                }
            }

            bluetoothLeAdvertiser.startAdvertising(settings, data, advertiseCallback)

        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }

    @ReactMethod
    fun stopAdvertising(promise: Promise) {
        try {
            val bluetoothManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            val adapter = bluetoothManager?.adapter
            val bluetoothLeAdvertiser = adapter?.bluetoothLeAdvertiser

            advertiseCallback?.let {
                bluetoothLeAdvertiser?.stopAdvertising(it)
            }
            advertiseCallback = null
            promise.resolve("stopped")
        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }
}

// TODO_MIRAN: register in MainApplication.kt getPackages():
// packages.add(ForegroundServicePackage())
// packages.add(BLEAdvertiserPackage())
