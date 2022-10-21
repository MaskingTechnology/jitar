
import { IsBoolean } from 'class-validator';

export default class HealthDto
{
    @IsBoolean()
    healthy = false;

    @IsBoolean({ each: true })
    checks: Map<string, boolean> = new Map();
}
