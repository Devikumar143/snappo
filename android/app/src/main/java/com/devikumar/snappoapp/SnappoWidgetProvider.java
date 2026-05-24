package com.devikumar.snappoapp;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.widget.RemoteViews;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.AppWidgetTarget;
import com.bumptech.glide.request.transition.Transition;

public class SnappoWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
        String mediaUrl = prefs.getString("last_snap_url", null);
        String status = prefs.getString("last_snap_status", "No new snaps");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.snappo_widget);
        views.setTextViewText(R.id.widget_text, status);

        if (mediaUrl != null && !mediaUrl.isEmpty()) {
            AppWidgetTarget target = new AppWidgetTarget(context, R.id.widget_image, views, appWidgetId) {
                @Override
                public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                    super.onResourceReady(resource, transition);
                }
            };

            Glide.with(context.getApplicationContext())
                    .asBitmap()
                    .load(mediaUrl)
                    .into(target);
        } else {
            views.setImageViewResource(R.id.widget_image, android.R.drawable.ic_menu_gallery);
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if ("com.devikumar.snappoapp.UPDATE_WIDGET".equals(intent.getAction())) {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(new ComponentName(context, SnappoWidgetProvider.class));
            for (int appWidgetId : appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }
}
