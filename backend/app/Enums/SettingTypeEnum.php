<?php

namespace App\Enums;

enum SettingTypeEnum: string
{
    case String = 'string';
    case Boolean = 'boolean';
    case Integer = 'integer';
    case Json = 'json';
}
