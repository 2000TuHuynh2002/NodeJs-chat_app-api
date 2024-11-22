type App_Role = "admin" | "moderator" | "user";
type App_User = { blockedBy: string[]; roles: App_Role[]; id: string };
type App_Room = {
  id: string;
  name: string;
  userId: string;
  invitedUsers: string[];
};

type App_Permissions = {
  role: {
    dataType: App_Role;
    action: "view" | "create" | "update";
  };
  user: {
    dataType: App_User;
    action: "view" | "create" | "update" | "delete";
  };
};

type PermissionCheck<Key extends keyof App_Permissions> =
  | boolean
  | ((user: App_User, data: App_Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in App_Role]: Partial<{
    [Key in keyof App_Permissions]: Partial<{
      [Action in App_Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

const ROLES = {
  admin: {
    role: {
      view: true,
      create: true,
      update: true,
    },
    user: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  moderator: {
    role: {
      view: true,
      create: true,
      update: true,
    },
    user: {
      view: true,
      create: true,
      update: true,
    },
  },
  user: {
    user: {
      view: true,
      update: (user, data) => user.id === data.id,
      delete: (user, data) => user.id === data.id,
    },
  },
} as const satisfies RolesWithPermissions;

function hasPermission<App_Resource extends keyof App_Permissions>(
  user: App_User,
  resource: App_Resource,
  action: App_Permissions[App_Resource]["action"],
  data?: App_Permissions[App_Resource]["dataType"]
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}

export default hasPermission;