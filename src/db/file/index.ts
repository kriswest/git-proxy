import * as users from './users';
import * as repo from './repo';
import * as pushes from './pushes';

export const {
  getPushes,
  writeAudit,
  getPush,
  authorise,
  cancel,
  reject,
  canUserCancelPush,
  canUserApproveRejectPush,
} = pushes;

export const {
  getRepos,
  getRepo,
  createRepo,
  addUserCanPush,
  addUserCanAuthorise,
  removeUserCanPush,
  removeUserCanAuthorise,
  deleteRepo,
  isUserPushAllowed,
  canUserApproveRejectPushRepo,
} = repo;

export const {
  findUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} = users;
