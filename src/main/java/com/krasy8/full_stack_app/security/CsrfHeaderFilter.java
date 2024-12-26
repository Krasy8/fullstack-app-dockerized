//package com.krasy8.full_stack_app.security;
//
//
//import jakarta.annotation.Nullable;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.web.csrf.CsrfToken;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//public class CsrfHeaderFilter extends OncePerRequestFilter {
//
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, @Nullable HttpServletResponse response,
//                                    @Nullable FilterChain filterChain) throws ServletException, IOException {
//        // Fetch the CSRF token from the request attribute
//        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
//        if (csrfToken != null) {
//            assert response != null;
//            response.setHeader("X-XSRF-TOKEN", csrfToken.getToken());
//        }
//        // Continue with the filter chain
//        assert filterChain != null;
//        filterChain.doFilter(request, response);
//    }
//}
