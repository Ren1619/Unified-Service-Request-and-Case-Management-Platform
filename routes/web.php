<?php

use App\Http\Controllers\CaseController;
use App\Http\Controllers\ComplaintTypeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactGroupController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\UserAccessController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('summary/export/overview', [SummaryController::class, 'exportOverview'])->name('summary.export.overview');
    Route::get('summary/export/status', [SummaryController::class, 'exportStatus'])->name('summary.export.status');
    Route::get('summary/export/activity', [SummaryController::class, 'exportActivity'])->name('summary.export.activity');
    Route::get('summary', SummaryController::class)->name('summary.index');
    Route::patch('cases/{case}/status', [CaseController::class, 'updateStatus'])->name('cases.status');
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
