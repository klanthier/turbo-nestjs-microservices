import { Prisma } from '~prisma';

export function usingClientKey(keys: string[]) {
  // Augment our prisma service to filter out RLS based on an array of client-keys
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SELECT set_config('app.client_keys', ${keys.join(
                ',',
              )}, TRUE)`,
              query(args),
            ]);

            return result;
          },
        },
      },
    }),
  );
}
