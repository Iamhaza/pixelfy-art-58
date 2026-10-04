create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.claim_admin_if_none()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (auth.uid(), 'admin');
  end if;
  return public.has_role(auth.uid(), 'admin');
end $$;
create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
grant execute on function public.claim_admin_if_none() to authenticated;
grant execute on function public.admin_exists() to anon, authenticated;

create type public.property_type as enum ('apartment','villa','home','plot');
create type public.lead_status as enum ('new','contacted','closed');

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type property_type not null,
  location text not null default '',
  city text not null default '',
  address text not null default '',
  price_from numeric not null default 0,
  description text not null default '',
  configuration text not null default '',
  bedrooms int,
  bathrooms int,
  area text not null default '',
  plot_area text not null default '',
  road_width text not null default '',
  facing text not null default '',
  highlights text[] not null default '{}',
  amenities text[] not null default '{}',
  project_status text not null default '',
  possession text not null default '',
  developer text not null default '',
  rera text not null default '',
  map_link text not null default '',
  images text[] not null default '{}',
  floor_plans text[] not null default '{}',
  featured boolean not null default false,
  new_launch boolean not null default false,
  published boolean not null default true,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.properties to anon, authenticated;
grant insert, update, delete on public.properties to authenticated;
grant all on public.properties to service_role;
alter table public.properties enable row level security;
create policy "public read published" on public.properties for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.properties for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.properties for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.properties for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  property_id uuid references public.properties(id) on delete set null,
  property_name text not null default '',
  property_type text not null default '',
  location text not null default '',
  status lead_status not null default 'new',
  created_at timestamptz not null default now()
);
grant select, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "admin read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update leads" on public.leads for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'Aranya Homes',
  logo_url text not null default '',
  phone text not null default '+919876543210',
  whatsapp text not null default '919876543210',
  email text not null default 'sales@aranyahomes.in',
  address text not null default 'Chennai, Tamil Nadu',
  instagram text not null default '',
  facebook text not null default '',
  youtube text not null default '',
  linkedin text not null default ''
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin'));
insert into public.site_settings(id) values (1);

create policy "admin read property images" on storage.objects for select to authenticated using (bucket_id = 'property-images' and public.has_role(auth.uid(),'admin'));
create policy "admin upload property images" on storage.objects for insert to authenticated with check (bucket_id = 'property-images' and public.has_role(auth.uid(),'admin'));
create policy "admin delete property images" on storage.objects for delete to authenticated using (bucket_id = 'property-images' and public.has_role(auth.uid(),'admin'));

insert into public.properties (slug,name,type,location,city,price_from,configuration,bedrooms,bathrooms,area,plot_area,road_width,facing,description,highlights,amenities,project_status,possession,developer,rera,images,featured,new_launch) values
('premium-3-bhk-apartments-omr','Premium 3 BHK Apartments','apartment','OMR','Chennai',14500000,'3 BHK',3,3,'1,850 sq.ft','','','','Spacious 3 BHK residences on the IT corridor with abundant natural light, cross ventilation and a landscaped central courtyard.','{"5 min to IT parks","Vaastu compliant","Covered car parking","Rainwater harvesting"}','{"Swimming pool","Gym","Clubhouse","Children''s play area","24x7 security","Power backup"}','Under Construction','Dec 2027','Aranya Homes','TN/29/Building/0123/2025','{"/images/apartment-1.jpg","/images/interior-1.jpg","/images/amenity-pool.jpg"}',true,false),
('luxury-villa-chennai','Luxury 4 BHK Villas','villa','ECR','Chennai',32500000,'4 BHK',4,5,'3,400 sq.ft','2,400 sq.ft','','East','Gated-community villas near the coast with private gardens, double-height living rooms and premium finishes.','{"Private garden","Near beach","Gated community","Home automation"}','{"Clubhouse","Jogging track","Landscaped parks","24x7 security","Party hall"}','Ready to Move','Ready','Aranya Homes','TN/29/Building/0456/2024','{"/images/villa-1.jpg","/images/interior-1.jpg","/images/amenity-pool.jpg"}',true,false),
('whitefield-2-bhk-residences','Whitefield 2 BHK Residences','apartment','Whitefield','Bengaluru',8900000,'2 BHK',2,2,'1,210 sq.ft','','','','Smartly planned 2 BHK homes close to tech parks and the metro, ideal for young families.','{"Near metro","Close to ITPL","Smart home ready"}','{"Gym","Rooftop garden","Indoor games","Power backup"}','New Launch','Jun 2028','Aranya Homes','PRM/KA/RERA/1251/2025','{"/images/apartment-2.jpg","/images/interior-1.jpg","/images/amenity-pool.jpg"}',true,true),
('gachibowli-sky-villas','Gachibowli Sky Villas','villa','Gachibowli','Hyderabad',41000000,'4 BHK Duplex',4,4,'4,100 sq.ft','','','North-East','Duplex sky villas with private terraces and panoramic city views in the financial district.','{"Private terrace","City views","Financial district"}','{"Infinity pool","Spa","Clubhouse","Concierge"}','Under Construction','Mar 2028','Aranya Homes','P02400005678','{"/images/villa-2.jpg","/images/interior-1.jpg","/images/amenity-pool.jpg"}',true,true),
('saravanampatti-independent-homes','Saravanampatti Independent Homes','home','Saravanampatti','Coimbatore',7500000,'3 BHK',3,3,'1,650 sq.ft','1,200 sq.ft','30 ft','East','Independent homes with car porch and a private terrace in a quiet, well-connected neighbourhood.','{"Independent house","Car porch","Near schools"}','{"Park","Street lighting","Underground drainage"}','Ready to Move','Ready','Aranya Homes','TN/11/Building/0789/2024','{"/images/home-1.jpg","/images/interior-1.jpg"}',true,false),
('hinjewadi-family-homes','Hinjewadi Family Homes','home','Hinjewadi','Pune',11500000,'3 BHK',3,3,'1,900 sq.ft','1,500 sq.ft','40 ft','West','Contemporary row homes near the Rajiv Gandhi Infotech Park with private gardens.','{"Row house","Private garden","Near IT park"}','{"Clubhouse","Children''s play area","Security"}','Under Construction','Sep 2027','Aranya Homes','P52100045678','{"/images/home-1.jpg","/images/interior-1.jpg"}',false,false),
('oragadam-residential-plots','Oragadam Residential Plots','plot','Oragadam','Chennai',2400000,'Residential Plots',null,null,'','1,200 sq.ft','30 ft','East / North','DTCP-approved residential plots with clear titles near the industrial corridor.','{"DTCP approved","Clear title","Ready for construction"}','{"Tar roads","Street lights","Compound wall","Overhead tank"}','Ready to Construct','Immediate','Aranya Homes','TN/01/Layout/2345/2025','{"/images/plot-1.jpg"}',true,true),
('devanahalli-villa-plots','Devanahalli Villa Plots','plot','Devanahalli','Bengaluru',3600000,'Villa Plots',null,null,'','1,500 sq.ft','40 ft','North','Gated villa plots near the airport with underground utilities and landscaped avenues.','{"Near airport","BMRDA approved","Gated layout"}','{"Underground cabling","Avenue trees","Clubhouse","Security"}','Ready to Construct','Immediate','Aranya Homes','PRM/KA/RERA/1250/2024','{"/images/plot-1.jpg"}',true,false);
