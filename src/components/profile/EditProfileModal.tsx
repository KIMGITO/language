import React from 'react';
import { Profile } from '../../types';
import { useProfileStore } from '../../stores/profileStore';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
}

export function EditProfileModal({ open, onOpenChange, profile }: EditProfileModalProps) {
  const { updateCurrentProfile, loading } = useProfileStore();

  const [formData, setFormData] = React.useState({
    display_name: profile.display_name,
    bio: profile.bio,
    country: profile.country,
    timezone: profile.timezone,
    availability: profile.availability || '',
    learning_goals: profile.learning_goals || '',
    avatar_url: profile.avatar_url || '',
  });

  React.useEffect(() => {
    setFormData({
      display_name: profile.display_name,
      bio: profile.bio,
      country: profile.country,
      timezone: profile.timezone,
      availability: profile.availability || '',
      learning_goals: profile.learning_goals || '',
      avatar_url: profile.avatar_url || '',
    });
  }, [profile]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateCurrentProfile(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update profile details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Display Name
              </label>
              <Input
                value={formData.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Country
              </label>
              <Input
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">
              Bio
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Background and learning goals..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Timezone
              </label>
              <Input
                value={formData.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                placeholder="e.g. GMT-5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Availability
              </label>
              <Input
                value={formData.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
                placeholder="e.g. Evenings"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">
              Goals
            </label>
            <Input
              value={formData.learning_goals}
              onChange={(e) => handleChange('learning_goals', e.target.value)}
              placeholder="e.g. Conversational practice"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">
              Avatar URL
            </label>
            <Input
              value={formData.avatar_url}
              onChange={(e) => handleChange('avatar_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
