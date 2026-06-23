<?php

use App\Http\Controllers\CaseController;
use App\Http\Controllers\ComplaintTypeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactGroupController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\UserAccessController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('summary', SummaryController::class)->name('summary.index');
    Route::resource('cases', CaseController::class);
    Route::resource('complaint-types', ComplaintTypeController::class);
    Route::inertia('messages/send', 'messages/send')->name('messages.send');
    Route::inertia('messages/inbox', 'messages/inbox')->name('messages.inbox');
    Route::inertia('messages/sent', 'messages/sent')->name('messages.sent');
    Route::inertia('messages/outbox', 'messages/outbox')->name('messages.outbox');
    Route::inertia('call-logs', 'call-logs/index')->name('call-logs.index');
    Route::resource('contacts', ContactController::class);
    Route::get('groups/cluster', [ContactGroupController::class, 'cluster'])->name('groups.cluster');
    Route::resource('groups', ContactGroupController::class);
    Route::resource('regions', RegionController::class);
    Route::resource('users', UserAccessController::class)->only(['index', 'show', 'edit', 'update']);
});

require __DIR__.'/settings.php';
