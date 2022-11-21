
import { IsBoolean } from 'npm:class-validator@^0.13.2';

export default class HealthDto
{
    @IsBoolean()
    healthy = false;

    @IsBoolean({ each: true })
    checks: Map<string, boolean> = new Map();
}
