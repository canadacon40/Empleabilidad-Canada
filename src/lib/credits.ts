import prisma from "./db";

/**
 * Validates and consumes 1 credit from a user.
 * 
 * - Paid "isPro" users have unlimited access (bypass decrement).
 * - Trial "isTrial" users must have > 0 credits to proceed.
 * 
 * @param userId The ID or Email of the user
 * @returns { success: boolean, remaining: number, isPro: boolean }
 */
export async function consumeCredit(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: userId },
        { email: userId }
      ]
    }
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Bypass for official PRO users
  if (user.isPro) {
    return { success: true, remaining: user.credits, isPro: true };
  }

  // Check trial credits
  if (user.isTrial) {
    if (user.credits > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } }
      });
      return { success: true, remaining: updatedUser.credits, isPro: false };
    } else {
      return { success: false, remaining: 0, isPro: false };
    }
  }

  // Default block for users with no status
  return { success: false, remaining: 0, isPro: false };
}
