import { logError } from "./logger.js"

//============================================================================
// EXERCISE 7: Currency Confusion
//
// ANTI-PATTERN: Using a raw `number` for money without specifying the unit.
// Is 1850 dollars or cents? When two developers use different conventions,
// adding their values produces nonsense.
//
// DDD FIX: Create a Money Value Object that pairs amount with currency/unit.
// In DDD, a Value Object is defined by its attributes and has no identity.
// Money is a textbook example -- $10 is $10 regardless of which bill it is.
//
// HINT - Money Value Object:
//   type Currency = "USD" | "EUR" | "GBP"
//
//   class Money {
//       private constructor(
//           private readonly cents: number, // always stored in smallest unit
//           public readonly currency: Currency,
//       ) {}
//
//       static fromDollars(amount: number, currency: Currency): Money {
//           return new Money(Math.round(amount * 100), currency)
//       }
//       static fromCents(cents: number, currency: Currency): Money {
//           if (!Number.isInteger(cents)) throw new Error("Cents must be integer")
//           return new Money(cents, currency)
//       }
//
//       add(other: Money): Money {
//           if (this.currency !== other.currency)
//               throw new Error("Cannot add different currencies")
//           return new Money(this.cents + other.cents, this.currency)
//       }
//
//       format(): string {
//           return `$${(this.cents / 100).toFixed(2)}`
//       }
//   }
//
// KEY INSIGHT: By storing everything in cents (smallest unit), you avoid
// floating-point issues. The type system prevents mixing currencies, and
// the single representation eliminates dollars-vs-cents ambiguity.
// ============================================================================

export function exercise7_CurrencyConfusion() {

		  type Currency = "USD" | "EUR" | "GBP"

  class Money {
      private constructor(
          private readonly cents: number, // always stored in smallest unit
          public readonly currency: Currency,
      ) {}

      static fromDollars(amount: number, currency: Currency): Money {
          return new Money(Math.round(amount * 100), currency)
      }
      static fromCents(cents: number, currency: Currency): Money {
          if (!Number.isInteger(cents)) throw new Error("Cents must be integer")
          return new Money(cents, currency)
      }

      add(other: Money): Money {
          if (this.currency !== other.currency)
              throw new Error("Cannot add different currencies")
          return new Money(this.cents + other.cents, this.currency)
      }

      format(): string {
          return `$${(this.cents / 100).toFixed(2)}`
      }
  }


	type MenuItem = {
		name: string
		price: Money // In what currency? Cents? Dollars?
	}

	const burger: MenuItem = {
		name: "Burger",
		price: Money.fromDollars(12.5, "USD"), // Is this $12.50 or 12.5 cents?
	}

	const pizza: MenuItem = {
		name: "Pizza",
		price: Money.fromDollars(18.5, "USD"), // Is this $18.50 or $1850?
	}

	// TODO: Replace `number` with a Money Value Object.
	// Force a single canonical representation (e.g., cents) so that
	// adding burger.price + pizza.price always means the same thing.

	// Calculations produce unexpected results
	const total = burger.price.add(pizza.price) // 12.5 + 18.5 = 31.0
	const formattedTotal = total.format() // $31.00

	logError(7, "Currency unit confusion leads to calculation errors", {
		items: [burger, pizza],
		calculatedTotal: formattedTotal,
		issue: "Are prices in dollars or cents? TypeScript doesn't know!",
	})
}
