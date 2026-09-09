import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Report } from '../../types';
import { useSafetyStore } from '../../stores/safetyStore';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const REPORT_REASONS: Report['reason'][] = [
  'Harassment',
  'Spam',
  'Inappropriate content',
  'Fake profile',
  'Hate or abuse',
  'Other',
];

export function ReportDialog() {
  const {
    reportDialogOpen,
    closeReportDialog,
    targetUser,
    reportReason,
    reportDescription,
    setReportReason,
    setReportDescription,
    submitReport,
    isSubmitting,
  } = useSafetyStore();

  if (!targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReport();
  };

  return (
    <Dialog open={reportDialogOpen} onOpenChange={closeReportDialog} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Report</span>
          </div>
          <DialogTitle>Report {targetUser.display_name}</DialogTitle>
          <DialogDescription>
            Submit an issue for review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-semibold text-app-text mb-1.5">
              Reason
            </label>
            <Select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as Report['reason'])}
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1.5">
              Details (optional)
            </label>
            <Textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeReportDialog}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
