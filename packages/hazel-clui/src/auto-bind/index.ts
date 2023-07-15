export interface Options {
	/**
	Bind only the given methods.
	*/
	readonly include?: ReadonlyArray<string | RegExp>

	/**
	Bind methods except for the given methods.
	*/
	readonly exclude?: ReadonlyArray<string | RegExp>
}

/**
Automatically bind methods to their class instance.

@param self - An object with methods to bind.

@example
```
import autoBind from 'auto-bind';

class Unicorn {
	constructor(name) {
		this.name = name;
		autoBind(this);
	}

	message() {
		return `${this.name} is awesome!`;
	}
}

const unicorn = new Unicorn('Rainbow');

// Grab the method off the class instance
const message = unicorn.message;

// Still bound to the class instance
message();
//=> 'Rainbow is awesome!'

// Without `autoBind(this)`, the above would have resulted in
message();
//=> Error: Cannot read property 'name' of undefined
```
*/
export default function autoBind<SelfType extends Record<string, any>>(
	// This has to use `any` to be compatible with classes.
	self: SelfType,
	options?: Options,
): SelfType {
	const filter = (key: string) => {
		const match = (pattern: string | RegExp) => (typeof pattern === "string" ? key === pattern : pattern.test(key))

		if (options?.include) {
			return options.include.some(match)
		}

		if (options?.exclude) {
			return !options.exclude.some(match)
		}

		return true
	}

	for (const [object, key] of getAllProperties(self.constructor.prototype) as any) {
		if (key === "constructor" || !filter(key)) {
			continue
		}

		const descriptor = Reflect.getOwnPropertyDescriptor(object, key)
		if (descriptor && typeof descriptor.value === "function") {
			;(self as any)[key] = self[key].bind(self)
		}
	}

	return self
}

// Gets all non-builtin properties up the prototype chain.
const getAllProperties = (obj: object) => {
	const properties = new Set()

	do {
		for (const key of Reflect.ownKeys(obj)) {
			properties.add([obj, key])
		}
		// rome-ignore lint: idk
	} while ((obj = Reflect.getPrototypeOf(obj)!) && obj !== Object.prototype)

	return properties
}
