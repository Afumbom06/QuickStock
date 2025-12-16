import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building2,
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { StaffMember, StaffPermissions } from '../../utils/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';

export function StaffManagementTab() {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Sarah Manager',
      email: 'sarah@quickstock.cm',
      phone: '+237 6 XX XX XX XX',
      role: 'manager',
      branchId: '1',
      permissions: {
        canMakeSales: true,
        canAddExpenses: true,
        canManageInventory: true,
        canViewReports: true,
        canManageCustomers: true,
        canDeleteRecords: true,
      },
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cashier' as StaffMember['role'],
    branchId: '1',
    status: 'active' as 'active' | 'inactive',
    permissions: {
      canMakeSales: false,
      canAddExpenses: false,
      canManageInventory: false,
      canViewReports: false,
      canManageCustomers: false,
      canDeleteRecords: false,
    } as StaffPermissions,
  });

  const roleLabels = {
    manager: 'Manager',
    cashier: 'Cashier',
    inventory_manager: 'Inventory Manager',
    sales_rep: 'Sales Representative',
  };

  const roleColors = {
    manager: 'bg-purple-100 text-purple-700',
    cashier: 'bg-blue-100 text-blue-700',
    inventory_manager: 'bg-green-100 text-green-700',
    sales_rep: 'bg-orange-100 text-orange-700',
  };

  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      synced: false,
    };
    setStaff([...staff, newStaff]);
    toast.success('Staff member added successfully!');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditStaff = () => {
    if (!editingStaff) return;
    
    setStaff(staff.map(s => 
      s.id === editingStaff.id 
        ? { ...s, ...formData }
        : s
    ));
    toast.success('Staff member updated successfully!');
    setIsDialogOpen(false);
    setEditingStaff(null);
    resetForm();
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter(s => s.id !== staffId));
    toast.success('Staff member removed successfully!');
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      branchId: member.branchId,
      status: member.status,
      permissions: { ...member.permissions },
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'cashier',
      branchId: '1',
      status: 'active',
      permissions: {
        canMakeSales: false,
        canAddExpenses: false,
        canManageInventory: false,
        canViewReports: false,
        canManageCustomers: false,
        canDeleteRecords: false,
      },
    });
    setEditingStaff(null);
  };

  const applyRoleTemplate = (role: StaffMember['role']) => {
    const templates: Record<StaffMember['role'], StaffPermissions> = {
      manager: {
        canMakeSales: true,
        canAddExpenses: true,
        canManageInventory: true,
        canViewReports: true,
        canManageCustomers: true,
        canDeleteRecords: true,
      },
      cashier: {
        canMakeSales: true,
        canAddExpenses: false,
        canManageInventory: false,
        canViewReports: false,
        canManageCustomers: true,
        canDeleteRecords: false,
      },
      inventory_manager: {
        canMakeSales: false,
        canAddExpenses: false,
        canManageInventory: true,
        canViewReports: true,
        canManageCustomers: false,
        canDeleteRecords: false,
      },
      sales_rep: {
        canMakeSales: true,
        canAddExpenses: false,
        canManageInventory: false,
        canViewReports: true,
        canManageCustomers: true,
        canDeleteRecords: false,
      },
    };
    
    setFormData({ ...formData, role, permissions: templates[role] });
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl text-gray-900">Staff Management</h2>
          <p className="text-gray-600 mt-1">
            {staff.length} {staff.length === 1 ? 'member' : 'members'} total
          </p>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
              </DialogTitle>
              <DialogDescription>
                {editingStaff 
                  ? 'Update staff member information and permissions'
                  : 'Add a new team member and configure their access'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Basic Info */}
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+237 6 XX XX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: StaffMember['role']) => applyRoleTemplate(value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                    <SelectItem value="sales_rep">Sales Representative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permissions */}
              <div className="border-t pt-4">
                <Label className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  Permissions
                </Label>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {[
                    { key: 'canMakeSales', label: 'Make Sales' },
                    { key: 'canAddExpenses', label: 'Add Expenses' },
                    { key: 'canManageInventory', label: 'Manage Inventory' },
                    { key: 'canViewReports', label: 'View Reports' },
                    { key: 'canManageCustomers', label: 'Manage Customers' },
                    { key: 'canDeleteRecords', label: 'Delete Records' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center gap-2">
                      <Checkbox
                        id={perm.key}
                        checked={formData.permissions[perm.key as keyof StaffPermissions]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              [perm.key]: checked === true,
                            },
                          })
                        }
                      />
                      <Label htmlFor={perm.key} className="cursor-pointer">
                        {perm.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingStaff ? handleEditStaff : handleAddStaff}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="flex-1"
              >
                {editingStaff ? 'Update' : 'Add'} Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterRole}
              onValueChange={setFilterRole}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="manager">Managers</SelectItem>
                <SelectItem value="cashier">Cashiers</SelectItem>
                <SelectItem value="inventory_manager">Inventory Managers</SelectItem>
                <SelectItem value="sales_rep">Sales Reps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <Badge 
                        className={`mt-1 ${roleColors[member.role]}`}
                      >
                        {roleLabels[member.role]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStaff(member.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  Main Branch
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(member.permissions)
                      .filter(([_, value]) => value)
                      .map(([key]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No staff members found</h3>
            <p className="text-sm text-gray-600">
              {searchTerm || filterRole !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first team member to get started'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
