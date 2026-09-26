import { type User, UsersService } from 'api';

export interface LoaderData {
  user: User | null;
}

async function loader(): Promise<LoaderData> {
  const { data } = await UsersService.getUser();
  return { user: data ?? null };
}

export default loader;
