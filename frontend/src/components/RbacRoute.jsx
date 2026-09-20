import React from 'react';
import AccessDeniedView from './AccessDeniedView';

export default function RbacRoute({
  allowedRoles = [],
  currentRole = 'LEAD_INVESTIGATOR',
  currentUser,
  onRoleChange,
  pageTitle,
  children
}) {
  const hasAccess = allowedRoles.includes(currentRole) || currentRole === 'ADMIN';

  if (!hasAccess) {
    return (
      <AccessDeniedView
        requiredRoles={allowedRoles}
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleChange={onRoleChange}
        pageTitle={pageTitle}
      />
    );
  }

  return children;
}
