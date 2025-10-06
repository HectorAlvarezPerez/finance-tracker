# Deployment Guide

Complete guide to deploying your Finance Tracker app to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project set up
- Domain name (optional)

## Step-by-Step Deployment

### 1. Prepare Your Supabase Project

#### A. Create Production Database

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (choose a region close to your users)
3. Wait for database to provision

#### B. Run Schema Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of `supabase/schema.sql`
3. Paste and **Run** the migration
4. Verify tables are created in **Table Editor**

#### C. Get API Keys

1. Go to **Settings > API**
2. Copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (`SUPABASE_SERVICE_ROLE_KEY`) - ⚠️ Keep this secret!

### 2. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/finance-tracker.git
git push -u origin main
```

### 3. Deploy to Vercel

#### A. Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New > Project**
3. Import your GitHub repository
4. Select **Next.js** framework preset

#### B. Configure Environment Variables

In the **Environment Variables** section, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_ENABLE_REALTIME_PRICES=false
NEXT_PUBLIC_ENABLE_BANK_INTEGRATION=false
```

#### C. Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Your app is live! 🎉

### 4. Configure Supabase for Production

#### A. Update Auth Settings

1. In Supabase dashboard, go to **Authentication > URL Configuration**
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/dashboard`

#### B. Configure Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Customize:
   - **Confirm Signup** template
   - **Reset Password** template
   - Add your branding

### 5. Seed Initial Data

After deploying, create your first user and seed data:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Set environment variables locally for seeding
vercel env pull .env.local

# Run seed script
npm run db:seed
```

### 6. Custom Domain (Optional)

#### In Vercel:

1. Go to **Settings > Domains**
2. Add your domain (e.g., `finance.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to use your custom domain

#### In Supabase:

Update redirect URLs to use your custom domain.

## Production Checklist

- [ ] Database schema migrated
- [ ] RLS policies enabled and tested
- [ ] Environment variables configured
- [ ] Auth redirect URLs set correctly
- [ ] Email templates customized
- [ ] Default data seeded
- [ ] Test user signup and login
- [ ] Test all core features
- [ ] Configure custom domain (if using)
- [ ] Set up error monitoring (optional)

## Monitoring & Maintenance

### Vercel Analytics

1. Enable in **Settings > Analytics** (free for hobby projects)
2. Monitor page views, performance, and errors

### Supabase Monitoring

1. Check **Database > Usage** for query performance
2. Monitor **Auth > Users** for signup rates
3. Review **API > Logs** for errors

### Error Handling

Production errors are logged in:
- Vercel Functions logs
- Supabase API logs
- Browser console (client-side errors)

## Scaling Considerations

### Free Tier Limits

**Vercel Free Tier:**
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- Unlimited deployments

**Supabase Free Tier:**
- 500 MB database storage
- 2 GB bandwidth/month
- 50,000 monthly active users

### When to Upgrade

Upgrade when you hit:
- 1,000+ active users
- 100+ transactions/day
- Need for faster database performance
- Custom auth flows

### Performance Optimization

1. **Database**:
   - Add indexes for frequently queried fields
   - Use pagination for large result sets
   - Archive old transactions

2. **Frontend**:
   - Enable Vercel Edge caching
   - Optimize images with Next.js Image component
   - Lazy load heavy components

3. **API**:
   - Implement rate limiting
   - Cache expensive queries
   - Use Vercel Edge Functions for global performance

## Backup Strategy

### Automatic Backups (Supabase Pro)

Supabase Pro includes daily backups. For free tier:

1. **Manual Exports**:
```bash
# Export database
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

2. **Scheduled Backups**:
Use Vercel Cron to trigger backup API routes weekly.

## Troubleshooting

### Build Failures

```bash
# Check build logs in Vercel
vercel logs

# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

### Auth Issues

1. Verify redirect URLs match exactly
2. Check CORS settings in Supabase
3. Ensure cookies are enabled

### Database Connection

1. Test connection in Supabase SQL Editor
2. Verify RLS policies aren't blocking queries
3. Check service role key is correct

### Deployment Not Updating

```bash
# Force redeploy
vercel --prod --force

# Or trigger from Git
git commit --allow-empty -m "Force redeploy"
git push
```

## Security Best Practices

1. **Never commit** `.env` files
2. **Rotate** service role keys periodically
3. **Enable** 2FA on Vercel and Supabase accounts
4. **Review** RLS policies regularly
5. **Monitor** auth logs for suspicious activity
6. **Limit** API rate limits per user
7. **Validate** all user inputs on server side

## Updates & Maintenance

### Deploying Updates

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel automatically deploys on push to `main`.

### Database Migrations

For schema changes:

1. Create migration SQL file
2. Test in staging environment
3. Run in production during low-traffic hours
4. Backup before running

### Rolling Back

```bash
# In Vercel dashboard
# Go to Deployments → Find working version → Promote to Production
```

## Cost Estimates

### Starting Out (Free Tier)
- Vercel: $0/month
- Supabase: $0/month
- **Total: $0/month**

### Growing (1,000 users)
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- **Total: $45/month**

### Established (10,000 users)
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Additional bandwidth: ~$10/month
- **Total: $55/month**

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Community**: GitHub Discussions, Discord

---

**Questions?** Open an issue on GitHub or contact support.

