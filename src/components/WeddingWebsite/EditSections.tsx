import React from 'react';
import { Button } from '../ui/button';
import { WeddingWebsiteData, ThemeType, ThemeConfig } from './types';
import { THEMES } from './constants';

interface EditSectionsProps {
  editingSection: string;
  websiteData: WeddingWebsiteData;
  updateWebsiteData: (updates: Partial<WeddingWebsiteData>) => void;
}

export default function EditSections({ editingSection, websiteData, updateWebsiteData }: EditSectionsProps) {
  switch (editingSection) {
    case 'basic':
      return (
        <div className="space-y-6">
          <h3 className="text-lg text-amber-800">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-amber-700 mb-2">Bride's Name</label>
              <input
                type="text"
                value={websiteData.coupleNames.bride}
                onChange={(e) => updateWebsiteData({
                  coupleNames: { ...websiteData.coupleNames, bride: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Bride's name"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-700 mb-2">Groom's Name</label>
              <input
                type="text"
                value={websiteData.coupleNames.groom}
                onChange={(e) => updateWebsiteData({
                  coupleNames: { ...websiteData.coupleNames, groom: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Groom's name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">Wedding Date</label>
            <input
              type="date"
              value={websiteData.weddingDate}
              onChange={(e) => updateWebsiteData({ weddingDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">Venue Name</label>
            <input
              type="text"
              value={websiteData.venue.name}
              onChange={(e) => updateWebsiteData({
                venue: { ...websiteData.venue, name: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="e.g. The Royal Oak"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">Venue Address</label>
            <textarea
              value={websiteData.venue.address}
              onChange={(e) => updateWebsiteData({
                venue: { ...websiteData.venue, address: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Full venue address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-amber-700 mb-2">Ceremony Time</label>
              <input
                type="time"
                value={websiteData.venue.ceremonyTime}
                onChange={(e) => updateWebsiteData({
                  venue: { ...websiteData.venue, ceremonyTime: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-700 mb-2">Reception Time</label>
              <input
                type="time"
                value={websiteData.venue.receptionTime}
                onChange={(e) => updateWebsiteData({
                  venue: { ...websiteData.venue, receptionTime: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>
      );

    case 'story':
      return (
        <div className="space-y-6">
          <h3 className="text-lg text-amber-800">Your Love Story</h3>
          <div>
            <label className="block text-sm text-amber-700 mb-2">Tell your story</label>
            <textarea
              value={websiteData.story}
              onChange={(e) => updateWebsiteData({ story: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Share how you met, your proposal story, or any special memories..."
              rows={8}
            />
          </div>
        </div>
      );

    case 'theme':
      return (
        <div className="space-y-6">
          <h3 className="text-lg text-amber-800">Choose Your Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(THEMES) as [ThemeType, ThemeConfig][]).map(([key, theme]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  websiteData.theme === key 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateWebsiteData({ theme: key })}
              >
                <div className={`h-16 w-full rounded-lg mb-3 ${theme.preview}`}></div>
                <h4 className="text-amber-800">{theme.name}</h4>
                <div className="flex gap-2 mt-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'rsvp':
      return (
        <div className="space-y-6">
          <h3 className="text-lg text-amber-800">RSVP Settings</h3>
          
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={websiteData.rsvp.enabled}
                onChange={(e) => updateWebsiteData({
                  rsvp: { ...websiteData.rsvp, enabled: e.target.checked }
                })}
                className="rounded"
              />
              <span className="text-sm text-amber-700">Enable RSVP on website</span>
            </label>
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">RSVP Deadline</label>
            <input
              type="date"
              value={websiteData.rsvp.deadline}
              onChange={(e) => updateWebsiteData({
                rsvp: { ...websiteData.rsvp, deadline: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">RSVP Message</label>
            <textarea
              value={websiteData.rsvp.message}
              onChange={(e) => updateWebsiteData({
                rsvp: { ...websiteData.rsvp, message: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="We hope you can join us on our special day..."
              rows={4}
            />
          </div>
        </div>
      );

    case 'registry':
      return (
        <div className="space-y-6">
          <h3 className="text-lg text-amber-800">Gift Registry</h3>
          
          <div>
            <label className="block text-sm text-amber-700 mb-2">Registry Message</label>
            <textarea
              value={websiteData.giftRegistry.message}
              onChange={(e) => updateWebsiteData({
                giftRegistry: { ...websiteData.giftRegistry, message: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Your presence is our present, but if you'd like to honor us with a gift..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">Registry Links</label>
            <div className="space-y-3">
              {websiteData.giftRegistry.links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.store}
                    onChange={(e) => {
                      const updatedLinks = [...websiteData.giftRegistry.links];
                      updatedLinks[index] = { ...link, store: e.target.value };
                      updateWebsiteData({
                        giftRegistry: { ...websiteData.giftRegistry, links: updatedLinks }
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="Store name (e.g., John Lewis)"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const updatedLinks = [...websiteData.giftRegistry.links];
                      updatedLinks[index] = { ...link, url: e.target.value };
                      updateWebsiteData({
                        giftRegistry: { ...websiteData.giftRegistry, links: updatedLinks }
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="Registry URL"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedLinks = websiteData.giftRegistry.links.filter((_, i) => i !== index);
                      updateWebsiteData({
                        giftRegistry: { ...websiteData.giftRegistry, links: updatedLinks }
                      });
                    }}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedLinks = [...websiteData.giftRegistry.links, { store: '', url: '' }];
                  updateWebsiteData({
                    giftRegistry: { ...websiteData.giftRegistry, links: updatedLinks }
                  });
                }}
                className="w-full"
              >
                Add Registry Link
              </Button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}