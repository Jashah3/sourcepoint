-- Add user_id column to Diet Tracker table for proper user ownership
ALTER TABLE "Diet Tracker" ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();

-- Add foreign key reference (optional, for data integrity)
-- ALTER TABLE "Diet Tracker" ADD CONSTRAINT fk_diet_tracker_user_id 
-- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Users can view their own diet tracker data" ON "Diet Tracker";
DROP POLICY IF EXISTS "Users can insert their own diet tracker data" ON "Diet Tracker";
DROP POLICY IF EXISTS "Users can update their own diet tracker data" ON "Diet Tracker";
DROP POLICY IF EXISTS "Users can delete their own diet tracker data" ON "Diet Tracker";

-- Create secure policies that validate user ownership
CREATE POLICY "Users can view their own diet tracker data" 
ON "Diet Tracker" 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diet tracker data" 
ON "Diet Tracker" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diet tracker data" 
ON "Diet Tracker" 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diet tracker data" 
ON "Diet Tracker" 
FOR DELETE 
USING (auth.uid() = user_id);