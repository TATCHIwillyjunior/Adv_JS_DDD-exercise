import { logError } from "./logger.js"

//============================================================================
// EXERCISE 1: Primitive Obsession - The Price Problem
//
// ANTI-PATTERN: Using a raw `number` for price. Nothing prevents negative
// values, absurdly large amounts, or mixing up units (see also Exercise 7).
//
// DDD FIX: Create a Value Object (or Branded Type) for Price.
// A Value Object is an immutable domain concept defined by its value, not by
// an identity. It enforces its own invariants at construction time.
//
// HINT - Branded Type approach:
//   type Price = number & { readonly __brand: unique symbol }
//   function createPrice(amount: number): Price {
//       if (amount < 0) throw new Error("Price cannot be negative")
//       if (amount > 10_000) throw new Error("Price exceeds maximum")
//       return amount as Price
//   }
//
// With this pattern, `MenuItem.price` becomes `Price` instead of `number`.
// TypeScript will refuse to assign a plain number where a Price is expected,
// so every price in the system is guaranteed valid by construction.
// ============================================================================

export function exercise1_PrimitivePrice() {
	// Without domain types, price is just a number
	type Price = number & { readonly __brand: unique symbol }
	type MenuItem = {
		name: string
		price: Price // Could be negative! Could be a huge number!
		quantity: number
	}

	const orderItem: MenuItem = {
		name: "Burger",
		price: createPrice(-50), // Silent bug! Negative price
		quantity: 1,
	}
	
	function createPrice(amount:number): Price {
		if (amount < 0) {
			throw new Error("Price cannot be negative 😔😔")
		}
		if (amount > 10000) {
			throw new Error("Price exceed the maximium 😔")
		}
		return amount as Price
	}

	

	// TODO: Replace `number` with a Price branded type.
	// The goal is to make this line a compile-time error:
	//   price: -50   // <-- should NOT be assignable to Price
	// Instead, force callers through createPrice(-50), which throws at runtime.

	const total = orderItem.price * orderItem.quantity
	logError(1, "Negative price accepted without complaint", {
		item: orderItem.name,
		price: orderItem.price,
		calculatedTotal: total,
		issue: "Price should never be negative!",
	})
}
