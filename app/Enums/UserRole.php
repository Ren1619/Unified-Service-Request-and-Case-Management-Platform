<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case CentralAdministrator = 'central_administrator';
    case RegionalAdministrator = 'regional_administrator';
    case Supervisor = 'supervisor';
    case CustomerServiceAgent = 'customer_service_agent';
    case CaseOfficer = 'case_officer';
    case Citizen = 'citizen';

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::CentralAdministrator => 'Central Administrator',
            self::RegionalAdministrator => 'Regional Administrator',
            self::Supervisor => 'Supervisor',
            self::CustomerServiceAgent => 'Customer Service Agent',
            self::CaseOfficer => 'Case Officer',
            self::Citizen => 'Citizen',
        };
    }
}
