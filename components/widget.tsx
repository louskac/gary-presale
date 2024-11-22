'use client';

import React, { useState, useEffect } from 'react';
import { HelioCheckout } from '@heliofi/checkout-react';
import CountdownTimer from '@/components/countdown-timer';
import { Rounds } from '@/components/rounds';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

const helioConfig = {
  paylinkId: '673e710280c4829574924b17',
  theme: { themeMode: 'light' },
  primaryColor: '#FF1F70',
  neutralColor: '#061022',
  display: 'inline',
  onSuccess: (event) => console.log(event),
  onError: (event) => console.log(event),
  onPending: (event) => console.log(event),
  onCancel: () => console.log('Cancelled payment'),
  onStartPayment: () => console.log('Starting payment'),
};

export function Widget({ className }: { className?: string }) {
  const [showHelio, setShowHelio] = useState(false);

  const handlePayment = () => {
    setShowHelio(true);
  };

  useEffect(() => {
    if (showHelio) {
      const interval = setInterval(() => {
        const helioContainer = document.querySelector('.hel-min-w-\\[380px\\]') as HTMLElement;
        if (helioContainer) {
          console.log('Element found');
          helioContainer.style.setProperty('max-width', '380px', 'important');
          helioContainer.style.setProperty('min-width', '0', 'important');
          clearInterval(interval);
        }
      }, 100);
  
      return () => clearInterval(interval);
    }
  }, [showHelio]);

  useEffect(() => {
    if (showHelio) {
      // Dynamically add hover styles to the document head
      const styleId = 'helio-dynamic-hover-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .helio-note-container:hover .helio-redirect-note,
          .helio-note-container:hover .helio-asterisk {
            color: #ffffff; /* Change both the text and * to white on hover */
          }
        `;
        document.head.appendChild(style);
      }
  
      const interval = setInterval(() => {
        const payByCardElement = Array.from(document.querySelectorAll('p.helio-text-label')).find(
          (el) => el.textContent?.trim() === 'Pay with card'
        );
  
        if (payByCardElement) {
          const parentContainer = payByCardElement.parentElement;
          if (parentContainer) {
            parentContainer.style.padding = '8px 12px';
            parentContainer.style.borderRadius = '6px';
          }
  
          if (!document.querySelector('.helio-redirect-note')) {
            const noteContainer = document.createElement('div');
            noteContainer.className = 'helio-note-container';
            noteContainer.style.marginTop = '8px';
            noteContainer.style.textAlign = 'left';
            noteContainer.style.fontSize = '0.75rem';
            noteContainer.style.color = '#6B7280'; // Default color
  
            const asterisk = document.createElement('span');
            asterisk.className = 'helio-asterisk';
            asterisk.style.color = '#FF4C61'; // Default color for *
            asterisk.style.fontWeight = 'bold';
            asterisk.textContent = '*';
  
            const note = document.createElement('span');
            note.className = 'helio-redirect-note';
            note.textContent = ' This action will redirect you to the Helio website.';
  
            noteContainer.appendChild(asterisk);
            noteContainer.appendChild(note);
  
            payByCardElement.parentElement?.parentElement?.appendChild(noteContainer);
          }
        }
      }, 100);
  
      return () => clearInterval(interval);
    }
  }, [showHelio]);
  

  useEffect(() => {
    if (showHelio) {
      const interval = setInterval(() => {
        const labels = document.querySelectorAll('label');

        if (labels.length >= 3) {
          const quantityLabel = labels[2];
          console.log('Third label found:', quantityLabel);

          quantityLabel.childNodes[0].textContent = 'Amount of GARA ';
  
          clearInterval(interval);
        }
      }, 100);
  
      return () => clearInterval(interval);
    }
  }, [showHelio]);
  
  return (
    <section
      className={`relative w-full max-w-full rounded-2xl md:rounded-t-2xl bg-gradient-to-b from-white to-[#CFEFFF] ${
        showHelio ? 'p-0' : 'p-6'
      } px-1 md:px-4 shadow-md ${className}`}
    >
      <h3 className="mb-6 text-center font-heading text-4xl font-bold text-gary-blue">
        Buy GARA
      </h3>

      <Table className="text-base">
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell className="!p-1 font-bold">Total supply of GARA coins</TableCell>
            <TableCell className="!p-1 text-end font-bold text-gary-pink">900M GARA</TableCell>
          </TableRow>
          <TableRow className="hover:bg-transparent">
            <TableCell className="!p-1 font-bold">Amount of GARA in pre-sale</TableCell>
            <TableCell className="!p-1 text-end font-bold text-gary-pink">99M GARA</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4 grid grid-cols-[1fr_180px_1fr] gap-2">
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black"></div>
        </div>
        <p className="text-center font-heading font-bold">
          Time Left - 1<sup>st</sup> round
        </p>
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black"></div>
        </div>
      </div>

      <div className="my-4 flex flex-row justify-center">
        <CountdownTimer />
      </div>

      <div className="mt-8 grid grid-cols-[1fr_120px_1fr] gap-2">
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black"></div>
        </div>
        <p className="text-center font-heading font-bold">Rounds</p>
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black"></div>
        </div>
      </div>

      <Rounds />

      {/* Button to Show Helio Widget */}
      {!showHelio ? (
        <div className="mt-8 flex flex-col gap-4">
          <Button
            onClick={handlePayment}
            className="my-2 h-14 border-2 border-transparent bg-gary-pink px-10 text-2xl text-white shadow-md outline-none transition-all hover:bg-white hover:text-gary-pink hover:border-gary-pink dark:hover:bg-white dark:hover:text-gary-pink"
          >
            Buy GARA
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <HelioCheckout config={helioConfig} />
        </div>
      )}

      <p className="my-4 flex items-center justify-center space-x-2">
        <span className="text-xl leading-none">Powered by</span>
        <span className="inline-flex items-center">
          <Image src="/images/gara-coin/helio.svg" alt="Polygon" width={80} height={40} />
        </span>
      </p>
    </section>
  );
}
