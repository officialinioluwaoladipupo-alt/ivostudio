import React from 'react';
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'u1vwbcb0';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = '2026-09-16';

export const urlFor = (source) => {
  if (!source) return '';
  return typeof source === 'string' ? source : source.url || source.asset?.url || '';
};

async function sanityFetch(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Sanity request failed: ${response.status}`);
  return (await response.json()).result;
}

export const projectQuery = `*[_type == "project" && !(_id in path("drafts.**"))] | order(displayOrder asc, year desc){
  _id,
  title,
  "slug": slug.current,
  summary,
  description,
  year,
  location,
  projectType,
  scale,
  role,
  collaborators,
  tools,
  "coverImage": coverImage.asset->{url, metadata},
  "galleryImages": galleryImages[]{..., "asset": asset->{url, metadata}},
  "processImages": processImages[]{..., "asset": asset->{url, metadata}},
  video,
  caseStudy,
  featured,
  order,
  status
}`;

export const homeHeroQuery = `*[_type == "homeHero"][0]{
  headline,
  subtext,
  ctaLabel,
  ctaLink
}`;

export const alsoBuildingQuery = `*[_type == "alsoBuildingEntry"] | order(order asc){
  _id,
  name,
  description,
  link,
  order
}`;

export const aboutQuery = `*[_type == "about"][0]{
  bio,
  "photo": photo.asset->{url, metadata},
  philosophy
}`;

export const resumeQuery = `*[_type == "resume"][0]{
  experience[]{
    role,
    organization,
    dates,
    description
  },
  education[]{
    institution,
    program,
    dates,
    notes
  },
  skillsAndTools
}`;

export const contactInfoQuery = `*[_type == "contactInfo"][0]{
  email,
  location,
  socialLinks[]{
    platform,
    url
  },
  privacyNote
}`;

export async function fetchProjects() {
  return sanityFetch(projectQuery);
}

export async function fetchHomeHero() {
  return sanityFetch(homeHeroQuery);
}

export async function fetchAlsoBuilding() {
  return sanityFetch(alsoBuildingQuery);
}

export async function fetchAbout() {
  return sanityFetch(aboutQuery);
}

export async function fetchResume() {
  return sanityFetch(resumeQuery);
}

export async function fetchContactInfo() {
  return sanityFetch(contactInfoQuery);
}

export function PortableTextRenderer({ value }) {
  if (!value || !Array.isArray(value)) return null;
  return React.createElement(
    React.Fragment,
    null,
    value.map((block, i) => {
      if (block._type !== 'block' || !block.children) return null;
      const text = block.children.map((child) => child.text).join('');
      const key = block._key || i;
      if (block.style === 'h1') return React.createElement('h1', { key }, text);
      if (block.style === 'h2') return React.createElement('h2', { key }, text);
      if (block.style === 'h3') return React.createElement('h3', { key }, text);
      if (block.style === 'blockquote') return React.createElement('blockquote', { key }, text);
      return React.createElement('p', { key }, text);
    })
  );
}
