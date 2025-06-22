'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type PaymentModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  feature: string;
  onSuccessfulPayment: () => void;
};

export default function PaymentModal({ isOpen, setIsOpen, feature, onSuccessfulPayment }: PaymentModalProps) {
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!/^(07|01)\d{8}$/.test(phone)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid Safaricom number (e.g., 0712345678).',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate STK push
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // On success, call the callback from the parent
    onSuccessfulPayment();
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock Premium Feature</DialogTitle>
          <DialogDescription>
            Pay KSH 20 via M-Pesa to unlock the <strong>{feature}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>Enter your M-Pesa phone number to initiate STK Push.</p>
          <Input
            type="tel"
            placeholder="0712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isProcessing}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay KSH 20'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
