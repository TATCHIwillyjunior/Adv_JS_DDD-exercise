import { logError } from "./logger.js"

//============================================================================
// EXERCISE 4: Business Rule Violation - Table Capacity
//
// ANTI-PATTERN: Using a plain data structure (anemic type) with no
// invariant enforcement. Nothing prevents currentGuests > capacity or
// negative guest counts. The type is just a bag of numbers.
//
// DDD FIX: Use an Entity with enforced invariants.
// Unlike Value Objects (which are defined by their value), an Entity has
// a unique identity (tableNumber) and a lifecycle. Invariants (business
// rules that must ALWAYS be true) are enforced in the constructor and
// in every method that mutates state.
//
// HINT - Entity with private constructor:
//   class Table {
//       private constructor(
//           public readonly tableNumber: number,
//           public readonly capacity: number,
//           private _currentGuests: number,
//       ) {}
//
//       static create(tableNumber: number, capacity: number): Table {
//           if (capacity <= 0) throw new Error("Capacity must be positive")
//           return new Table(tableNumber, capacity, 0)
//       }
//
//       get currentGuests(): number { return this._currentGuests }
//
//       seatGuests(count: number): void {
//           if (count <= 0) throw new Error("Guest count must be positive")
//           if (this._currentGuests + count > this.capacity)
//               throw new Error("Exceeds table capacity")
//           this._currentGuests += count
//       }
//   }
//
// KEY INSIGHT: The invariant (guests <= capacity) is enforced by the Entity
// itself. External code cannot put the Entity into an invalid state because
// there is no public way to set _currentGuests directly.
// ============================================================================

export function exercise4_BusinessRuleViolation() {
	
	// TODO: Replace the plain type with an Entity class that enforces
	// capacity constraints. The constructor/factory should reject invalid
	// states, and mutation should go through guarded methods (seatGuests).

	  class Table {
      private constructor(
          public readonly tableNumber: number,
          public readonly capacity: number,
          private _currentGuests: number,
      ) {}

      static create(tableNumber: number, capacity: number): Table {
          if (capacity <= 0) throw new Error("Capacity must be positive")
          return new Table(tableNumber, capacity, 0)
      }

      get currentGuests(): number { return this._currentGuests }

      seatGuests(count: number): void {
          if (count <= 0) throw new Error("Guest count must be positive(➕➕)")
          if (this._currentGuests + count > this.capacity)
              throw new Error("Exceeds table capacity 🙅🏾‍♂️🙅🏾‍♂️")
          this._currentGuests += count
      }
  }

	// const table: Table = {
	// 	tableNumber: 5,
	// 	capacity: 4,
	// 	currentGuests: 7, // Silent bug! Overcapacity
	// }

	//Correct way to create a table and seat guests
	// 
	const table= Table.create(5, 4)
	table.seatGuests(7) // Silent bug! Overcapacity

	logError(4, "Table overcapacity - business rule violated", {
		table,
		issue: "currentGuests should never exceed capacity!",
	})

	// Another violation - negative guests
	// const emptyTable: Table = {
	// 	tableNumber: 3,
	// 	capacity: 6,
	// 	currentGuests: -2, // Silent bug! Negative guests
	// }

	// Correct way to create an empty table
	const emptyTable = Table.create(3, 6)
	emptyTable.seatGuests(-2) // Silent bug! Negative guests

	logError(4, "Negative guest count - impossible in real world", {
		table: emptyTable,
		issue: "Guests cannot be negative!",
	})
}
