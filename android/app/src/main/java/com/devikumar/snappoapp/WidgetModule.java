package com.devikumar.snappoapp;

import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class WidgetModule extends ReactContextBaseJavaModule {
    WidgetModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "WidgetModule";
    }

    @ReactMethod
    public void updateWidget() {
        Intent intent = new Intent("com.devikumar.snappoapp.UPDATE_WIDGET");
        intent.setPackage(getReactApplicationContext().getPackageName());
        getReactApplicationContext().sendBroadcast(intent);
    }
}
