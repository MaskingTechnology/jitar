import { runProcedure } from "/jitar/hooks.js";

export async function sayHello(name) {
	return runProcedure('shared/sayHello', '0.0.0', { 'name': name }, this)
}
