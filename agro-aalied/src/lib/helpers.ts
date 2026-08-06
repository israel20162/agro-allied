import { BUCKETS, BUSINESS } from './config'
import { supabase } from './supabase'
import type { OrderStatus } from './types';
import { useState, useCallback } from 'react';

/** 12500 -> ₦12,500 */
export function formatNaira(amount: number): string {
  return '₦' + Number(amount || 0).toLocaleString('en-NG')
}

/** AF-4821-7K — short enough to read out over the counter. */
export function generateOrderNumber(): string {
  const digits = Math.floor(1000 + Math.random() * 9000)
  const letters = Math.random().toString(36).slice(2, 4).toUpperCase()
  return `AF-${digits}-${letters}`
}

/** 08031234567 -> 2348031234567, so wa.me links work. */
export function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0')) return '234' + digits.slice(1)
  return digits
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${toInternationalPhone(phone)}?text=${encodeURIComponent(message)}`
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Waiting for payment confirmation',
  paid: 'Payment confirmed — packing your order',
  almost_ready: 'Almost ready — about 2 more minutes',
  ready: 'Ready for pickup',
  completed: 'Picked up',
}

export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-leaf-100 text-leaf-800',
  almost_ready: 'bg-red-100 text-red-700',
  ready: 'bg-leaf-600 text-white',
  completed: 'bg-leaf-50 text-leaf-600',
}

/** Message the shop sends the customer on WhatsApp when a status changes. */
export function statusMessage(orderNumber: string, status: OrderStatus): string {
  if (status === 'ready') {
    return `Hello! Your ${BUSINESS.shortName} order ${orderNumber} is READY FOR PICKUP at ${BUSINESS.address}. See you shortly.`
  }
  if (status === 'almost_ready') {
    return `Hello! Your ${BUSINESS.shortName} order ${orderNumber} is almost ready. Please allow about 2 more minutes.`
  }
  return `Hello! Update on your ${BUSINESS.shortName} order ${orderNumber}: ${STATUS_LABEL[status]}.`
}

/**
 * Uploads a file to a Supabase storage bucket and returns its public URL.
 * Returns null when no file was chosen.
 */
export async function uploadFile(
  file: File | null,
  bucket: string = BUCKETS.uploads,
  folder = 'misc',
): Promise<string | null> {
  if (!file) return null
  const extension = file.name.split('.').pop() ?? 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`

  const { error } = await supabase.storage.from(bucket).upload(path, file)
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/** Visual stand-in until the shop uploads a real product photo. */
export function productEmoji(name: string): string {
  const map: Record<string, string> = {
    rice: '🍚', beans: '🫘', garri: '🥣', yam: '🍠', potato: '🥔',
    egg: '🥚', tomato: '🍅', pepper: '🌶️', onion: '🧅', oil: '🫗',
    bread: '🍞', fish: '🐟', chicken: '🍗', turkey: '🦃', plantain: '🍌',
  }
  const lower = name.toLowerCase()
  const hit = Object.keys(map).find((key) => lower.includes(key))
  return hit ? map[hit] : '🛒'
}



export function useClipboard(delay = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback((text: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard API not supported");
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), delay);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
      console.log(text)
  }, [delay]);

  return { isCopied, copy };
}
