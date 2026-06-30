<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Base event for domain events.
 */
abstract class BaseEvent
{
    use Dispatchable, SerializesModels;
}
