import { init } from "@/app";
import { prisma } from "@/config";
import authenticationService, { invalidCredentialsError } from "@/services/authentication-service";
import faker from "@faker-js/faker";
import { createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("signIn", () => {
  const generateParams = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(6),
  });

  it("Should throw InvalidCredentialError if there is no user for given email", async () => {
    const params = generateParams();

    try {
      await authenticationService.signIn(params);
      fail("Should throw InvalidCredentialError");
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  it("Should throw InvalidCredentialError if given password is invalid", async () => {
    const params = generateParams();
    await createUser({
      email: params.email,
      password: "invalid-password",
    });

    try {
      await authenticationService.signIn(params);
      fail("Should throw InvalidCredentialError");
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  describe("when email and password are valid", () => {
    it("Should return user data if given email and password are valid", async () => {
      const params = generateParams();
      const user = await createUser(params);

      const { user: signInUser } = await authenticationService.signIn(params);
      expect(user).toEqual(
        expect.objectContaining({
          id: signInUser.id,
          email: signInUser.email,
        }),
      );
    });

    it("Should create new session and return given token", async () => {
      const params = generateParams();
      const user = await createUser(params);

      const { token: createdSessionToken } = await authenticationService.signIn(params);

      expect(createdSessionToken).toBeDefined();
      const session = await prisma.session.findFirst({
        where: {
          token: createdSessionToken,
          userId: user.id,
        },
      });
      expect(session).toBeDefined();
    });
  });
});
