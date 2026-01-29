export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  department: string
  avatar?: string
  managerId?: string // Added managerId to track reporting relationships
}

export interface OrgNode {
  id: string
  name: string
  role: string
  department: string
  teamCount: number
  avatar?: string
  members?: TeamMember[]
  children?: OrgNode[]
}

export interface OneOnOneMeeting {
  id: string
  employeeId: string
  employeeName: string
  employeeRole: string
  employeePhoto?: string
  managerId: string
  managerName: string
  status: "scheduled" | "pending" | "completed"
  scheduledDate?: string
  lastMeetingDate?: string
  performance?: string
}

export function getDirectReports(orgNode: OrgNode, managerId: string): TeamMember[] {
  const directReports: TeamMember[] = []

  function traverseNode(node: OrgNode) {
    if (node.id === managerId && node.members) {
      // Get all team members except the leader themselves
      const teamMembers = node.members.filter((member) => member.id !== managerId)
      directReports.push(
        ...teamMembers.map((member) => ({
          ...member,
          managerId: managerId,
        })),
      )
    }

    if (node.members) {
      node.members.forEach((member) => {
        if (member.id === managerId) {
          // This member is a manager, find their direct reports in child nodes
          if (node.children) {
            node.children.forEach((child) => {
              if (child.members) {
                const childReports = child.members.filter((childMember) => childMember.id !== child.id)
                directReports.push(
                  ...childReports.map((report) => ({
                    ...report,
                    managerId: managerId,
                  })),
                )
              }
            })
          }
        }
      })
    }

    // Recursively check children nodes
    if (node.children) {
      node.children.forEach((child) => traverseNode(child))
    }
  }

  traverseNode(orgNode)
  console.log(`[v0] Found ${directReports.length} direct reports for manager ${managerId}`)
  return directReports
}

export function syncOrgToOneOnOnes(orgData: OrgNode, managerId: string): OneOnOneMeeting[] {
  const directReports = getDirectReports(orgData, managerId)

  return directReports.map((employee) => ({
    id: `1on1-${managerId}-${employee.id}`,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeRole: employee.role,
    employeePhoto: employee.avatar,
    managerId: managerId,
    managerName: getManagerName(orgData, managerId),
    status: "pending" as const,
    scheduledDate: undefined,
    lastMeetingDate: undefined,
    performance: undefined,
  }))
}

function getManagerName(orgNode: OrgNode, managerId: string): string {
  function findManager(node: OrgNode): string | null {
    if (node.id === managerId) {
      return node.name
    }

    if (node.children) {
      for (const child of node.children) {
        const result = findManager(child)
        if (result) return result
      }
    }

    return null
  }

  return findManager(orgNode) || "Unknown Manager"
}

export function detectNewTeamMembers(
  previousOrgData: OrgNode,
  currentOrgData: OrgNode,
  managerId: string,
): TeamMember[] {
  const previousReports = getDirectReports(previousOrgData, managerId)
  const currentReports = getDirectReports(currentOrgData, managerId)

  // Find new members by comparing IDs
  const previousIds = new Set(previousReports.map((member) => member.id))
  const newMembers = currentReports.filter((member) => !previousIds.has(member.id))

  return newMembers
}
