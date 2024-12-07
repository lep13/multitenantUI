import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Decode token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.tag as keyof typeof allowedRoutes; // Explicitly type the userRole

      // Define allowed routes for each role
      const allowedRoutes = {
        admin: ['/admin', '/create-manager', '/delete-manager'],
        manager: ['/manager', '/create-user', '/delete-user', '/create-group', '/update-group'],
        user: ['/user', '/create-service', '/delete-service', '/create-amazon-ec2-elastic-compute-cloud', '/create-amazon-s3-simple-storage-service', '/create-aws-lambda', '/create-amazon-rds-relational-database-service', '/create-aws-cloudfront', '/create-amazon-vpc-virtual-private-cloud', '/create-amazon-dynamodb', '/create-compute-engine', '/create-cloud-storage', '/create-google-kubernetes-engine-gke', '/create-bigquery', '/create-cloud-sql'],
      };

      // Validate role for the requested route
      const currentRoute = state.url;
      if (allowedRoutes[userRole]?.includes(currentRoute)) {
        return true; // Allow access if role matches
      } else {
        console.warn(`Access denied for role: ${userRole} to route: ${currentRoute}`);
        this.router.navigate(['/login']);
        return false; // Redirect to login for unauthorized routes
      }
    } catch (error) {
      console.error('Token decoding failed or invalid token:', error);
      this.router.navigate(['/login']);
      return false; // Redirect to login on error
    }
  }
}
