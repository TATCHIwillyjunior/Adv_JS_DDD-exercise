import { logError } from "./logger.js";

//============================================================================
// EXERCISE 5: The Identity Crisis - Order IDs
//
// ANTI-PATTERN: Using a plain `string` for an identifier. Nothing enforces
// format, non-emptiness, or uniqueness. Duplicate and empty IDs slip through.
//
// DDD FIX: Model identity as a dedicated Value Object with a controlled
// creation strategy. In DDD, the identity of an Entity is a first-class
// concept -- it deserves its own type.
//
// HINT - Branded type + factory:
//   type OrderId = string & { readonly __brand: unique symbol }
//
//   // Option A: Enforce a format (e.g., "ORD-" prefix + numeric)
//   function createOrderId(raw: string): OrderId {
//       if (!/^ORD-\d{5,}$/.test(raw))
//           throw new Error("OrderId must match ORD-XXXXX format")
//       return raw as OrderId
//   }
//
//   // Option B: Generate guaranteed-unique IDs (UUID-based)
//   function generateOrderId(): OrderId {
//       return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` as OrderId
//   }
//
// For uniqueness across a collection, use a Repository pattern: the
// Repository is responsible for ensuring no two Entities share an ID.
// This separates identity validation (Value Object) from uniqueness
// enforcement (Repository).
// ============================================================================

export function exercise5_IdentityCrisis() {
  //
  //
  // What I'm doing (My work)
  type OrderId = string & { readonly __brand: unique symbol };

  // Option A: Enforce a format (e.g., "ORD-" prefix + numeric)
  function createOrderId(raw: string): OrderId {
    if (!/^ORD-\d{5,}$/.test(raw))
      throw new Error("OrderId must match ORD-XXXXX format");
    return raw as OrderId;
  }
  //
  //
  //

  type Order = {
    orderId: OrderId; // Just a string - could be anything!
    customerName: string;
    total: number;
  };

  // error type --- captures raw input and error details for logging instead of crashing
  type OrderError = {
    rawOrderId: string;
    customerName: string;
    total: number;
    error: string;
  };

  // TODO: Replace `string` with an OrderId branded type.
  // Use a factory function that enforces a consistent format.
  // Consider who is responsible for uniqueness (hint: Repository pattern).

  // What makes a valid order ID? Nothing enforced!
  // const orders: Order[] = [
  // 	{
  // 		orderId: createOrderId(""), // Silent bug! Empty ID
  // 		customerName: "Alice",
  // 		total: 25,
  // 	},
  // 	{
  // 		orderId: createOrderId("12345"), // Is this valid?
  // 		customerName: "Bob",
  // 		total: 30,
  // 	},
  // 	{
  // 		orderId: createOrderId("12345"), // Silent bug! Duplicate ID
  // 		customerName: "Charlie",
  // 		total: 15,
  // 	},
  // 	{
  // 		orderId: createOrderId("not-a-number"), // Silent bug! Inconsistent format
  // 		customerName: "Diana",
  // 		total: 20,
  // 	},
  // ]

  const invalidInput = {
    Alice: { orderId: "", customerName: "Alice", total: 25 },
    Bob: { orderId: "12345", customerName: "Bob", total: 30 },
    Charlie: { orderId: "12345", customerName: "Charlie", total: 15 },
    Diana: { orderId: "not-a-number", customerName: "Diana", total: 20 },
    Willy: { orderId: "ORD-12789", customerName: "Willy", total: 30 },
  };

  // checks for duplicate IDs, empty IDs, and inconsistent formats. Each invalid case is logged with a clear error message.
  class OrderRepository {
    private ids = new Set<OrderId>();

    ensuringUniqueId(id: OrderId): void {
      if (this.ids.has(id)) {
        throw new Error(`Duplicate OrderId detected: ${id}`);
      }
      this.ids.add(id);
    }
  }

  const orderRepo = new OrderRepository();

  //building orders while ensuring uniqueness( validation of order IDs) and logging any errors encountered during the process.

  const orders: (Order | OrderError)[] = [];

  for (const [key, raw] of Object.entries(invalidInput)) {
    try {
      // validate format and validity of the order ID(unique and correctly formatted) before creating the Order object. If the ID is invalid, an error is thrown and caught in the catch block.
      const id = createOrderId(raw.orderId);
      orderRepo.ensuringUniqueId(id);

      // If all good, push a real order
      orders.push({
        orderId: id,
        customerName: raw.customerName,
        total: raw.total,
      });
    } catch (err) {
      // Capture the error instead of crashing
      orders.push({
        rawOrderId: raw.orderId,
        customerName: raw.customerName,
        total: raw.total,
        error: (err as Error).message,
      });
    }
  }

  logError(5, "Order ID chaos - duplicates, empty, inconsistent formats", {
    orders,
    issue: "Order IDs have no enforced format or uniqueness!",
  });
}
